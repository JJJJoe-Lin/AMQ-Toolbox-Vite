import {
    Fzf,
    basicMatch,
    extendedMatch,
    byLengthAsc,
    byStartAsc,
    AsyncFzf
} from 'fzf';

function NormalizeName(name, camelize=false) {
    const rules = [
        {input: "ä@âàáạåæā", output: "a"},
        {input: "ß", output: "b"},
        {input: "č", output: "c"},
        {input: "éêëèæē", output: "e"},
        {input: "í", output: "i"},
        {input: "ñ", output: "n"},
        {input: "ōóòöôøΦ", output: "o"},
        {input: "uūûúùüǖ", output: "u"},
        {input: "×", output: "x"},
        {input: "²", output: "2"},
        {input: "³", output: "3"},
        {input: "’", output: "\'"},
        {input: "★☆·♥∽・〜†♪→␣", output: " "},
    ];
    let rule_map = new Map();
    for (let rule of rules) {
      for (let c of rule.input) {
        rule_map.set(c, rule.output)
      }
    }
    let ret = "";
    name.split('').forEach(c => {
        ret += rule_map.get(c) ?? c;
    });
    if (camelize) {
        ret = ret.replace(/(:?^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase());
    }
    return ret.replace(/\s\s+/g, ' ');
}

const InvalidAbbrRegex = /[^A-Z0-9:-]/;

function Abbreviate(name) {
    if (name.length == 0) {
        return ""
    }
    let abbr = name[0], abbr_offset = [0];
    for (let i = 1; i < name.length; ++i) {
        let current = name[i]
        let previous = name[i - 1]
        let next = name[i + 1] || ''
        if (InvalidAbbrRegex.test(current))  {
            continue;
        }
        if (current == ':' && next != ' ') {
            continue;
        }
        if (current == '-' && previous != ' ' && next != ' ') {
            continue;
        }
        abbr += current;
        abbr_offset.push(i);
    }
    return [abbr, abbr_offset];
}

function ToItemList(fzf_entries) {
    let items = [];
    for (let entry of fzf_entries) {
        items.push(entry.item);
    }
    return items;
}

function BuildTerms(input) {
    input = input.trim()
    input = input.replace(/\\ /g, "\t")
    let terms = input.split(/ +/)
    for (let i in terms) {
        terms[i] = terms[i].replace(/\t/g, " ")
    }
    return terms
}

class FinderResult {
    constructor(item) {
        this.item = item
        this.positions = new Set()
        this.start = item.name.length
        this.end = 0
        this.matched = 0
        this.abbr_score = 0
        this.score = 0
        this.basic_score = 0
    }
    reset() {
        this.positions.clear()
        this.start = this.item.name.length
        this.end = 0
        this.matched = 0
        this.abbr_score = 0
        this.score = 0
        this.basic_score = 0
    }
    merge(result) {
        for (const pos of result.positions) {
            this.positions.add(pos)
        }
        this.start = (this.start < result.start)? this.start : result.start;
        this.end = (this.end > result.end) ? this.end : result.end;
        this.score += result.score
        if (result.score > 0) {
            this.matched += 1
        }
    }
    setAbbrResult(result) {
        this.abbr_score = result.score
        this.positions.clear()
        for (const pos of result.positions) {
            if (!pos in this.item.abbr_offset) {
                console.log(`{pos} is not in {this.item.abbr_offset}`);
                continue;
            }
            this.positions.add(this.item.abbr_offset[pos])
        }
    }
    getNormScore(value) {
        let score = this.abbr_score || this.score
        return this.#normScore(value, score);
    }
    #goodScore(terms) {
        let concat_value = terms.join('')
        let token_count = terms.length;
        const score_match = 16;
        const bonus_first = 8;
        const bonus_consecutive = 8;
        const len = concat_value.length;
        return score_match * len + bonus_consecutive * (len - 1) + bonus_first * (token_count + 1);
    }
    #badScore(terms) {
        let concat_value = terms.join('')
        const score_match = 16;
        const score_gap_start = -3;
        const len = concat_value.length;
        return score_match * len + score_gap_start * (len - 1);
    }
    #normScore(value, score) {
        let terms = BuildTerms(value)
        let good_score = this.#goodScore(terms);
        let bad_score = this.#badScore(terms);
        return (score - bad_score) / (good_score - bad_score)
    }
}

class Finder {
    constructor(items) {
        this.items = items
        this.selector = (item) => item.normalized
        this.abbr_selector = (item) => item.abbr
        this.finder_opt = {
            casing: "case-insensitive",
            selector: this.selector,
            tiebreakers: [byLengthAsc, byStartAsc]
        };
        this.filter_opt = {
            casing: "case-insensitive",
            selector: this.selector,
            sort: false,
        };
        this.abbr_filter_opt = {
            selector: this.abbr_selector,
            sort: false,
        };
        this.finder = new Fzf(items, this.finder_opt);
        this.filter = new Fzf(items, this.filter_opt);
        this.abbr_filter = new Fzf(items, this.abbr_filter_opt);
    }
    find(value) {
        return this.finder.find(value)
    }
    filt(value) {
        return this.filter.find(value)
    }
    abbr_filt(value) {
        return this.abbr_filter.find(value)
    }
}

class CustomFzf {
    constructor(itemList) {
        let fzfList = [];
        for (let [idx, item] of itemList.entries()) {
            let normalized = NormalizeName(item)
            let camel_normalized = NormalizeName(item, true)
            const [abbr, abbr_offset] = Abbreviate(camel_normalized)
            fzfList.push({index: idx, name: item, normalized: normalized, abbr: abbr, abbr_offset: abbr_offset});
        }
        this.default_finder = new Finder(fzfList)

        // initialize the fzf map to pre-filter list to search
        this.finder_map = new Map();
        // alphabet sorted by occurrence frequency.
        const alphabet = [...'qxzjvwfpbycldgkmhutrsnoiea'];
        for (let a of alphabet) {
            setTimeout(() => {
                let entries = this.default_finder.filt(a);
                let items = ToItemList(entries);
                this.finder_map.set(a, new Finder(items));
            }, 10);
        }
        this.default_entries = fzfList.map((item) => new FinderResult(item))
    }
    getFinder(input) {
        // find suitable finder to search
        for (let [k, _] of this.finder_map) {
            if (input.includes(k)) {
                return this.finder_map.get(k);
            }
        }
        return this.default_finder
    }
    // Customized extended serach. There are some features inside original
    // extended search that we would like to remove. Also, this helps further
    // customize.
    extendedFind(input, limit = 1000) {
        let finder = this.getFinder(input);
        let terms = BuildTerms(input)
        if (terms.length == 0) {
            return
        }
        let entries = this.default_entries
        for (let entry of entries) {
            entry.reset()
        }
        for (let term of terms) {
            let term_entries = finder.filt(term)
            for (let entry of term_entries) {
                let idx = entry.item.index
                entries[idx].merge(entry);
            }
        }
        let filtered_entries
        if (terms.length == 1 && !InvalidAbbrRegex.test(input)) {
            let abbr_term = input
            let abbr_entries = finder.abbr_filt(abbr_term)
            for (let entry of abbr_entries) {
                let idx = entry.item.index
                entries[idx].setAbbrResult(entry)
            }
            filtered_entries = entries.filter((e) => e.abbr_score > 0 || e.matched == terms.length)
        } else {
            filtered_entries = entries.filter((e) => e.matched == terms.length)
        }
        filtered_entries.sort(function(a, b) {
            if (a.abbr_score != b.abbr_score) {
                return b.abbr_score - a.abbr_score
            }
            if (a.abbr_score > 0 && a.item.abbr.length != b.item.abbr.length) {
                return a.item.abbr.length - b.item.abbr.length
            }
            if (a.score != b.score) {
                return b.score - a.score
            }
            if (a.item.normalized.length != b.item.normalized.length) {
                return a.item.normalized.length - b.item.normalized.length
            }
            return a.start - b.start
        })
        return filtered_entries.slice(0, limit)
    }
    find(value) {
        let terms = BuildTerms(value)
        let entries = this.extendedFind(value);
        if (!entries) {
            console.log("Nothing found in extendedFind()")
        }

        let itemList = ToItemList(entries);

        // add basic match score
        let basic_fzf = new Fzf(itemList, {
            casing: "case-insensitive",
            selector: (item) => item.normalized,
            match: basicMatch,
            sort: false,
        });
        let concat_value = terms.join('')
        let basic_entries = basic_fzf.find(concat_value);

        let e = 0, b = 0;
        for (; e < entries.length && b < basic_entries.length; ++e) {
            let entry = entries[e];
            let basic_entry = basic_entries[b];
            if (entry.item.name == basic_entry.item.name) {
                entry.basic_score = basic_entry.score;
                b += 1;
            } else {
                entry.basic_score = 0;
            }
        }
        if (b != basic_entries.length) {
            console.log("unmatched basic entires item")
        }

        // sort by extended match score and basic match score
        entries.sort(function(a, b) {
            if (a.abbr_score != b.abbr_score) {
                return b.abbr_score - a.abbr_score
            }
            if (a.abbr_score > 0 && a.item.abbr.length != b.item.abbr.length) {
                return a.item.abbr.length - b.item.abbr.length
            }
            if (a.score != b.score) {
                return b.score - a.score
            }
            if (a.score != b.basic_score) {
                return b.basic_score - a.basic_score
            }
            if (a.item.normalized.length != b.item.normalized.length) {
                return a.item.normalized.length - b.item.normalized.length
            }
            return a.start - b.start
        })
        return entries;
    }
}

export function FzfAmqAwesomplete(input, o, scrollable) {
    console.log("AmqAwesomeplete init");
    o.autoFirst = true;

    o.filter = (text, input) => {
        return RegExp(input.trim(), "i").test(text);
    };
    Awesomplete.call(this, input, o);
    this.searchId = 0;
    this.currentSubList = null;
    this.o = o;

    this.customFzf = new CustomFzf(this.o.list);

    this.currentQuery = "";
    this.$ul = $(this.ul);
    if (scrollable) {
        let $input = $(input);
        let $awesompleteList = $input.parent().find('ul');
        $awesompleteList.perfectScrollbar({
            suppressScrollX: true
        });

        $input.on('awesomplete-open', () => {
            $awesompleteList.perfectScrollbar('update');
            $awesompleteList[0].scrollTop = 0;
        });
    }

    let create = function (tag, o) {
        var element = document.createElement(tag);
        for (var i in o) {
            var val = o[i];
            if (i === "inside") {
                $(val).appendChild(element);
            } else if (i === "around") {
                var ref = $(val);
                ref.parentNode.insertBefore(element, ref);
                element.appendChild(ref);
                if (ref.getAttribute("autofocus") != null) {
                    ref.focus();
                }
            } else if (i in element) {
                element[i] = val;
            } else {
                element.setAttribute(i, val);
            }
        }
        return element;
    };

    this.item = function (text, item_id) {
        var html = text;
        var element = create("li", {
            innerHTML: html,
            "role": "option",
            "aria-selected": "false",
            "id": "awesomplete_list_" + this.count + "_item_" + item_id
        });
        return element;
    };
}

export function FzfEvaluate() {
    if (this.once_disable_evaluate) {
        this.once_disable_evaluate = false;
        return;
    }

    var me = this;
    let value = this.input.value;
    if (value.length < this.minChars) {
        this.close({ reason: "nomatches" });
        this.status.textContent = "No results found";
        return;
    }

    this.searchId++;
    var currentSearchId = this.searchId;
    $("#qpAnswerInputLoadingContainer").removeClass("hide");
    this.index = -1;
    // Populate list with options that match
    this.$ul.children('li').remove();

    let handlePassedSuggestions = function (me) {
        this.suggestions = this.suggestions.slice(0, this.maxItems);
        for (let i = this.suggestions.length - 1; i >= 0; i--) {
            let suggestion = this.suggestions[i].label;
            me.ul.insertBefore(me.item(suggestion, i), me.ul.firstChild);
        }
        if (this.ul.children.length === 0) {
            this.status.textContent = "No results found";
            this.close({ reason: "nomatches" });
        } else {
            this.open();
            this.status.textContent = this.ul.children.length + " results found";
        }
        $("#qpAnswerInputLoadingContainer").addClass("hide");
    }.bind(this);

    // fzf search
    let normalizedValue = NormalizeName(value);
    let startTime = Date.now();
    let entries = this.customFzf.find(normalizedValue);
    let timeTaken = Date.now() - startTime;
    if (timeTaken > 100) {
        console.log("fzf search took long time:", timeTaken, "ms");
    }

    // fill the suggestions
    let fzf_suggestions = [];
    for (let i in entries) {
        if (i >= this.maxItems) {
            break;
        }
        let entry = entries[i];
        let positions = entry.positions;
        let name = entry.item.name;
        let label = ""
        for (let i = 0; i < name.length; ++i) {
            if (positions.has(i)) {
                label += "<mark>" + name[i] + "</mark>";
            } else {
                label += name[i];
            }
        }
        let norm_score = entry.getNormScore(normalizedValue);
        norm_score = Math.min(1, norm_score);
        norm_score = Math.max(0, norm_score);
        let color_hue = 120 * (norm_score * norm_score);
        let html = '<span style="color:hsl(' + color_hue + ', 60%, 80%);">' + label + "</span>"
        let suggestion = new Suggestion([html, name]);
        fzf_suggestions.push(suggestion);
    }
    this.suggestions = fzf_suggestions;
    handlePassedSuggestions(me);
};
