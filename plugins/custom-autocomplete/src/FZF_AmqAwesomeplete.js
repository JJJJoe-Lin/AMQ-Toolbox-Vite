import {
    Fzf,
    basicMatch,
    extendedMatch,
    byLengthAsc,
    byStartAsc,
} from 'fzf';

function NormalizeName(name) {
    //console.log("normalized name")
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

    // fzf init
    console.log("fzf init");
    let fzfList = [];
    this.o.list.forEach(inputEntry => {
        fzfList.push({name: inputEntry, NormalizedName: NormalizeName(inputEntry)});
    });
    this.fzf = new Fzf(fzfList, {
        casing: "case-insensitive",
        selector: (item) => item.NormalizedName,
        match: extendedMatch,
        tiebreakers: [byLengthAsc, byStartAsc],
    });

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
            }
            else if (i === "around") {
                var ref = $(val);
                ref.parentNode.insertBefore(element, ref);
                element.appendChild(ref);

                if (ref.getAttribute("autofocus") != null) {
                    ref.focus();
                }
            }
            else if (i in element) {
                element[i] = val;
            }
            else {
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
    var me = this;
    let unescapedValue = this.input.value;
    var value = createAnimeSearchRegexQuery(unescapedValue);

    if (value.length >= this.minChars && this.fzf) {
        this.searchId++;
        var currentSearchId = this.searchId;
        $("#qpAnswerInputLoadingContainer").removeClass("hide");
        this.index = -1;
        // Populate list with options that match
        this.$ul.children('li').remove();

        var suggestions = [];

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
        let normalizedValue = NormalizeName(unescapedValue)
        const entries = this.fzf.find(normalizedValue);
        // add basic match score
        for (let entry of entries) {
            let basic_fzf = new Fzf([entry.item.NormalizedName], {
                casing: "case-insensitive",
                match: basicMatch,
            });
            let basic_entries = basic_fzf.find(normalizedValue);
            if (basic_entries.length == 0) {
                entry.basic_score = 0
            } else {
                entry.basic_score = basic_entries[0].score;
                entry.basic_positions = basic_entries[0].positions;
            }
        }
        // sort by extended match score and basic match score
        entries.sort(function(a, b) {
            let factor_a = [-a.score, -a.basic_score, a.length, a.item.start]
            let factor_b = [-b.score, -b.basic_score, b.length, b.item.start]
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
        //console.log("fzf entry: ", entries);
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
    }
    else {
        this.close({ reason: "nomatches" });

        this.status.textContent = "No results found";
    }
};