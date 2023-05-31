import React, { useEffect, useState } from 'react'

const url = "http://localhost:3000"

const BuscadorPorId = ({ tipoObjeto, id }) => {

    const [objeto, setObjeto] = useState("");

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(`${url}/${tipoObjeto}/${id}`);
            const data = await resposta.json();
            setObjeto(data);
        }


        fetchData()

    }, []);

    return (
        <>
            {objeto.nome}
        </>
    )
}

export default BuscadorPorId