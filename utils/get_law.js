export async function getFullLaw(law_num, page_num) {
    const base_url = process.env.LAWDATA_URL;
    const url = `${base_url}${law_num}&type=XML`
    const res = await fetch(url);
    if (!res.ok) throw new Error("FETCH FAILED: INVALID URL");
    const data = await res.text();
    const { DOMParser } = require('xmldom')
    const xml = new DOMParser().parseFromString(data, 'text/xml');
    const law_db = [];
    const INDEX_ID = 1_000_000_000_000 * Number(page_num);
    let temp = {};
    const law_name = xml.getElementsByTagName('법령명_한글')[0].textContent; //법령-기본정보-법령명_한글
    temp.index = INDEX_ID;
    temp.text = law_name;
    law_db.push(temp);
    const article_set = xml.getElementsByTagName('조문단위'); //법령-조문-조문단위             
    for (let article_i = 1; article_i <= article_set.length; article_i++) {
        const article = article_set.item(article_i - 1); //조문단위
        const article_data_set = article.getElementsByTagName('조문내용')
        for (let article_data_set_i = 0; article_data_set_i < article_data_set.length; article_data_set_i++) {
            const article_data = article_data_set.item(article_data_set_i).textContent; //법령-조문-조문단위-조문내용
            //article_set > article > article_data article_db
            // article_db[INDEX_ID + article_i * 1_000_000_000] = article_data;
            temp = {};
            temp.index = INDEX_ID + article_i * 1_000_000_000;
            temp.text = article_data;
            law_db.push(temp);
        }
        const paragraph_set = article.getElementsByTagName('항');          //조문단위-항 
        for (let paragraph_i = 1; paragraph_i <= paragraph_set.length; paragraph_i++) {
            const paragraph = paragraph_set.item(paragraph_i - 1);   //항
            const paragraph_data_set = paragraph.getElementsByTagName('항내용');  //항-항내용
            for (let paragraph_data_set_i = 0; paragraph_data_set_i < paragraph_data_set.length; paragraph_data_set_i++) { //항내용
                const paragraph_data = paragraph_data_set.item(paragraph_data_set_i).textContent;
                //article_set > article > paragraph_set > paragraph > paragraph_data_set > paragraph_data  paragraph_db
                // paragraph_db[INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000] = paragraph_data;
                temp = {};
                temp.index = INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000;
                temp.text = paragraph_data;
                law_db.push(temp);
            }
            const sub_paragraph_set = paragraph.getElementsByTagName('호'); //항-호 
            for (let sub_paragraph_i = 1; sub_paragraph_i <= sub_paragraph_set.length; sub_paragraph_i++) {
                const sub_paragraph = sub_paragraph_set.item(sub_paragraph_i - 1);     //호
                const sub_paragraph_data_set = sub_paragraph.getElementsByTagName('호내용');  //호-호내용 
                for (let sub_paragraph_data_set_i = 0; sub_paragraph_data_set_i < sub_paragraph_data_set.length; sub_paragraph_data_set_i++) { //호내용
                    const sub_paragraph_data = sub_paragraph_data_set.item(sub_paragraph_data_set_i).textContent;
                    //article_set > article > paragraph_set > paragraph > sub_paragraph_set > sub_paragraph > sub_paragraph_data_set > sub_paragraph_data  sub_paragraph_db
                    // sub_paragraph_db[INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000 + sub_paragraph_i * 1_000] = sub_paragraph_data;
                    temp = {};
                    temp.index = INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000 + sub_paragraph_i * 1_000;
                    temp.text = sub_paragraph_data;
                    law_db.push(temp);
                }
                const item_set = sub_paragraph.getElementsByTagName('목'); //호-목
                for (let item_i = 1; item_i <= item_set.length; item_i++) {
                    const item = item_set.item(item_i - 1);   //목                 
                    const item_data_set = item.getElementsByTagName('목내용')  //목-목내용
                    for (let item_data_set_i = 0; item_data_set_i < item_data_set.length; item_data_set_i++) { //목내용
                        const item_data = item_data_set.item(item_data_set_i).textContent;
                        //article_set > article > paragraph_set > paragraph > sub_paragraph_data_set > sub_paragraph > item_set > item > item_data_set > item_data  item_db
                        // item_db[INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000 + sub_paragraph_i * 1_000 + item_i * 1] = item_data;
                        temp = {};
                        temp.index = INDEX_ID + article_i * 1_000_000_000 + paragraph_i * 1_000_000 + sub_paragraph_i * 1_000 + item_i * 1;
                        temp.text = item_data;
                        law_db.push(temp);
                    }
                }
            }
        }
    }
    return law_db;
}