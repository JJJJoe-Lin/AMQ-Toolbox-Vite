import {
    Fzf,
    basicMatch,
    extendedMatch,
    byLengthAsc,
    byStartAsc,
    AsyncFzf
} from 'fzf';

function NormalizeName(name) {
    const rules = [
        {input: "[aä@âàáạåæā]", output: "a"},
        {input: "[bß]", output: "b"},
        {input: "[č]", output: "c"},
        {input: "[eéêëèæē]", output: "e"},
        {input: "[ií]", output: "i"},
        {input: "[nñ]", output: "n"},
        {input: "[oōóòöôøΦ]", output: "o"},
        {input: "[uuūûúùüǖ]", output: "u"},
        {input: "[x×]", output: "x"},
        {input: "[2²]", output: "2"},
        {input: "[3³]", output: "3"},
        {input: "[\'’]", output: "\'"},
        {input: "[★☆·♥∽・〜†×♪→␣]", output: " "},
    ];
    let ret = "";
    name.split('').forEach(c => {
        rules.forEach(rule => {
            if(RegExp(rule.input).test(c)) {
                c = rule.output
            }
        })
        ret += c;
    });
    return ret.replace(/\s\s+/g, ' ');
}

function ToItemList(fzf_entries) {
  let items = [];
  for (let entry of fzf_entries) {
    items.push(entry.item);
  }
  return items;
}

class CustomFzf {
    constructor(itemList) {
        let fzfList = [];
        for (let item of itemList) {
            fzfList.push({name: item, NormalizedName: NormalizeName(item)});
        }
        this.fzf_opt = {
            casing: "case-insensitive",
            selector: (item) => item.NormalizedName,
            match: extendedMatch,
            limit: 1000,
            tiebreakers: [byLengthAsc, byStartAsc],
        };
        this.default_fzf = new Fzf(fzfList, this.fzf_opt);

        // initialize the fzf map to pre-filter list to search
        this.fzf_map = new Map();
        this.filter_opt = {
            casing: "case-insensitive",
            selector: (item) => item.NormalizedName,
            match: extendedMatch,
            tiebreakers: [byLengthAsc, byStartAsc],
        };
        let filter = new Fzf(fzfList, this.filter_opt);
        // alphabet sorted by occurrence frequency.
        const alphabet = [...'qxzjvwfpbycldgkmhutrsnoiea'];
        for (let a of alphabet) {
            let entries = filter.find(a);
            let items = ToItemList(entries);
            this.fzf_map.set(a, new Fzf(items, this.fzf_opt));
        }
    }
    find(value) {
        // find suitable fzf to search
        let fzf = this.default_fzf;
        for (let [k, _] of this.fzf_map) {
            if (value.includes(k)) {
                fzf = this.fzf_map.get(k);
                break;
            }
        }

        let entries = fzf.find(value);
        let itemList = ToItemList(entries);

        // add basic match score
        let basic_fzf = new Fzf(itemList, {
            casing: "case-insensitive",
            selector: (item) => item.NormalizedName,
            match: basicMatch,
            sort: false,
        });
        let basic_entries = basic_fzf.find(value);

        let e = 0, b = 0;
        for (; e < entries.length && b < basic_entries.length; ++e) {
            let entry = entries[e];
            let basic_entry = basic_entries[b];
            if (entry.item.name == basic_entry.item.name) {
                entry.basic_score = basic_entry.score;
                entry.basic_positions = basic_entry.positions;
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
            let factor_a = [-a.score, -a.basic_score, a.item.NormalizedName.length, a.start]
            let factor_b = [-b.score, -b.basic_score, b.item.NormalizedName.length, b.start]
            for (let i in factor_a) {
                if (factor_a[i] > factor_b[i]){
                    return 1;
                }
                if (factor_a[i] < factor_b[i]){
                    return -1;
                }
            }
            return 0;
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
        return create("li", {
            innerHTML: html,
            "role": "option",
            "aria-selected": "false",
            "id": "awesomplete_list_" + this.count + "_item_" + item_id
        });
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
    for (let entry of entries) {
        let positions = entry.basic_score > 0 ? entry.basic_positions : entry.positions;
        let name = entry.item.name;
        let label = ""
        for (let i = 0; i < name.length; ++i) {
            if (positions.has(i)) {
                label += "<mark>" + name[i] + "</mark>";
            } else {
                label += name[i];
            }
        }
        let suggestion = new Suggestion([label, name]);
        fzf_suggestions.push(suggestion);
    }
    this.suggestions = fzf_suggestions;
    handlePassedSuggestions(me);
};
