export default function ParseIndexToClassName(index) {
    if (index.toString().substr(1, 3) === "000") {
        return "law_title"
    }
    else if (index.toString().substr(4, 3) === "000") {
        return "law_article"
    }
    else if (index.toString().substr(7, 3) === "000") {
        return "law_paragraph"
    }
    else if (index.toString().substr(10, 3) === "000") {
        return "law_sub_paragraph"
    }
    else {
        return "law_item"
    }
}