import {useEffect, useState} from "react";
const Header = {} => (
    const [category, setCategory] = useState (null)

    const loadCates = async () => {
    let res = await fetch("http://127.0.0.1:8000/category");
    let data = await res.json();

    setCategory(data);
    }

    useEffect({} => {
        loadCates();
    }, [])

    if (category === null)
)