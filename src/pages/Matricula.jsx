import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { Button, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Buscador from '../components/Buscador';
import styles from './styles/Matricula.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BuscadorPorId from '../components/BuscadorPorId';

const url = "http://localhost:3000/matriculas"
const urlPaginaAlunos = "http://localhost:5173/alunos"

const Matricula = ({ modalOpen }) => {

    const { idAluno } = useParams();

    const [matriculasAluno, setMatriculasAluno] = useState([]);

    const [idDisciplinaEscolhida, setIdDisciplinaEscolhida] = useState("");

    const [modalShow, setModalShow] = useState(modalOpen);

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(url);
            const data = await resposta.json();
            setMatriculasAluno(data.filter((matricula) => matricula.aluno == idAluno));
        }

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (idDisciplinaEscolhida == "") {
            window.alert("É necessário selecionar uma disciplina.");
            return;
        }

        const matriculaNew = {
            aluno: idAluno,
            disciplina: idDisciplinaEscolhida
        };

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(matriculaNew)
        });

        closeModal();
    }

    const handleDelete = async (idMatricula) => {
        const resposta = await fetch(`${url}/${idMatricula}`, {
            method: "DELETE"
        })

        if (resposta.ok) {
            setMatriculasAluno(matriculasAluno.filter((matricula) => matricula.id != idMatricula));
        }
    }

    const closeModal = () => {
        setIdDisciplinaEscolhida("");
        setModalShow(false);
        location.href = urlPaginaAlunos;
    }

    return (
        <Modal show={modalShow} onHide={closeModal} size="lg" centered>
            <ModalHeader className='modalHeader'>
                <ModalTitle>Matricular Aluno</ModalTitle>
            </ModalHeader>

            <ModalBody>
                <h6>Disciplinas matriculadas:</h6>
                <ListGroup>
                    {matriculasAluno.map((matricula) =>
                        <ListGroup.Item key={matricula.id} className={styles.flex}>
                            {<BuscadorPorId tipoObjeto="disciplinas" id={matricula.disciplina} />}
                            <button onClick={() => handleDelete(matricula.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </ListGroup.Item>
                    )}
                </ListGroup>

                <form onSubmit={(e) => handleSubmit(e)} className='form'>
                    <label>Selecionar disciplina:</label>
                    <Buscador
                        tipoObjeto="disciplinas"
                        idElemento={idDisciplinaEscolhida}
                        setIdElemento={setIdDisciplinaEscolhida}
                        toIgnore={matriculasAluno.map((matricula) => matricula.disciplina)}
                    />

                    <input type="submit" value="Matricular" />
                </form>
            </ModalBody>
            <ModalFooter>
                <Button onClick={closeModal}>Cancelar</Button>
            </ModalFooter>

        </Modal >
    )
}

export default Matricula