import React, { useEffect, useState } from 'react'

const url = "http://localhost:3000";

const Buscador = ({ tipoObjeto, idElemento, setIdElemento, toIgnore = [] }) => {

    const [objetos, setObjetos] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(`${url}/${tipoObjeto}`);
            const data = await resposta.json();
            setObjetos(data);
        }

        fetchData();
    }, []);


    const buildReturn = () => {
        toIgnore = toIgnore.map((element) => parseInt(element));
        const returnSet = objetos.filter((objeto) => !toIgnore.includes(objeto.id));

        return returnSet;
    }


    return (
        <select name={tipoObjeto} value={idElemento} onChange={(e) => setIdElemento(e.target.value)}>
            <option value="">Escolha uma opção</option>
            {buildReturn().map((objeto) => <option value={objeto.id} key={objeto.id}>{objeto.nome}</option>)}
        </select>
    )
}

export default Buscador