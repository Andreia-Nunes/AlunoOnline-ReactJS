import React, { useEffect, useState } from 'react'
import Buscador from '../components/Buscador';
import BuscadorPorId from '../components/BuscadorPorId';
import Modal from 'react-bootstrap/Modal';
import { Alert, Button, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { CheckPermissionToDeleteDisciplinas } from '../components/CheckPermissionToDelete';

const url = "http://localhost:3000/disciplinas"

const Disciplinas = () => {

    const [disciplinas, setDisciplinas] = useState([]);

    const [nomeDisciplina, setNomeDisciplina] = useState("");

    const [idDisciplinaEscolhida, setIdDisciplinaEscolhida] = useState("");
    const [idProfessorEscolhido, setIdProfessorEscolhido] = useState("");

    const [isCadastro, setIsCadastro] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [alertExcluirShow, setAlertExcluirShow] = useState(false);
    const [alertSuccessShow, setAlertSuccessShow] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(url);
            const data = await resposta.json();
            setDisciplinas(data);
        }

        fetchData();
    }, []);


    const handleSubmit = (e) => {
        if (isCadastro) {
            e.preventDefault();
            setAlertSuccessShow(true);

        }
        setModalShow(false);

        if (idProfessorEscolhido == "") {
            window.alert("É necessário selecionar um professor.");
            return;
        }

        const disciplina = {
            nome: nomeDisciplina,
            professor: idProfessorEscolhido
        }

        if (isCadastro) {
            handleCreate(disciplina);
        } else {
            handleUpdate(disciplina);
        }

        setNomeDisciplina("");
        setIdProfessorEscolhido("");
    };

    const handleClickEditar = async (id) => {
        const resposta = await fetch(`${url}/${id}`);
        const data = await resposta.json();

        setIdDisciplinaEscolhida(id);
        setNomeDisciplina(data.nome);
        setIdProfessorEscolhido(data.professor);

        setIsCadastro(false);
        setModalShow(true);
    };

    const handleClickExcluir = async (id) => {
        setIsCadastro(false);

        const permissionToDelete = await CheckPermissionToDeleteDisciplinas(id);

        if (permissionToDelete) {
            handleDelete(id);
        }
        else {
            setAlertExcluirShow(true);
        }
    };

    const handleClickCadastrar = () => {
        setIsCadastro(true);
        setModalShow(true);
    };

    const handleClickCancelar = () => {
        setIsCadastro(false);
        setModalShow(false);

        setIdDisciplinaEscolhida("");
        setNomeDisciplina("");
        setIdProfessorEscolhido("");
    };

    const handleCreate = async (disciplina) => {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(disciplina)
        });

        const addedDisciplina = await resposta.json();

        setDisciplinas((prevDisciplinas) => [...prevDisciplinas, addedDisciplina]);
    }

    const handleUpdate = async (disciplina) => {
        const resposta = await fetch(`${url}/${idDisciplinaEscolhida}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(disciplina)
        });

        const updatedDisciplina = await resposta.json();

        setDisciplinas(disciplinas.map((disciplina) => {
            if (disciplina.id == updatedDisciplina.id) {
                return updatedDisciplina;
            } else {
                return disciplina;
            }
        }));

    }

    const handleDelete = async (id) => {
        const resposta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        if (resposta.ok) {
            setDisciplinas(disciplinas.filter((disciplina) => disciplina.id !== id));
        }
    }


    return (
        <div>
            <Alert variant="danger" show={alertExcluirShow} onClose={() => setAlertExcluirShow(false)} dismissible>
                Não é possível excluir. A disciplina possui alunos relacionados.
            </Alert>

            <Alert variant="success" show={alertSuccessShow} onClose={() => setAlertSuccessShow(false)} dismissible>
                Disciplina cadastrada com sucesso!
            </Alert>

            <table className='tableData'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Professor</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {disciplinas.map((disciplina) =>
                        <tr key={disciplina.id}>
                            <td>{disciplina.nome}</td>
                            <td>
                                <BuscadorPorId tipoObjeto="professores" id={disciplina.professor} />
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleClickEditar(disciplina.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleClickExcluir(disciplina.id)}>Excluir</Button>
                            </td>
                        </tr>)}
                </tbody>
            </table>

            <Button variant="outline-primary" size="lg" onClick={handleClickCadastrar} className='buttonCadastrar'>Cadastrar</Button>

            <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
                <ModalHeader className='modalHeader'>
                    <ModalTitle>{isCadastro ? "Cadastrar Disciplina" : "Editar Disciplina"}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => handleSubmit(e)} className='form'>
                        <label>Nome da Disciplina</label>
                        <input type="text" name="nomeDisciplina" value={nomeDisciplina} onChange={(e) => setNomeDisciplina(e.target.value)} />

                        <label>Selecionar Professor:</label>
                        <Buscador tipoObjeto="professores" idElemento={idProfessorEscolhido} setIdElemento={setIdProfessorEscolhido} />

                        <input type="submit" value={isCadastro ? "Cadastrar" : "Salvar"} />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleClickCancelar}>Cancelar</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Disciplinas