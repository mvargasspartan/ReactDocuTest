import { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import mdDocument from '../markdown/guidelines.md';

function Guidelines(){

    const [content, setContent] = useState("");

    useEffect(() => {
        fetch(mdDocument)
            .then(res => res.text())
            .then(md => { setContent(md) })
    })

    return(
        <div style={{"marginLeft": "1rem"}}>
            <Markdown children={content} />
        </div>
    );
}

export default Guidelines;