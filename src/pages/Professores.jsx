import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { CheckPermissionToDeleteProfessor } from '../components/CheckPermissionToDelete';

const url = "http://localhost:3000/professores"

const Professores = () => {

    const [professores, setProfessores] = useState([]);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");

    const [idProfessorEscolhido, setIdProfessorEscolhido] = useState("");

    const [isCadastro, setIsCadastro] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [alertExcluirShow, setAlertExcluirShow] = useState(false);
    const [alertSuccessShow, setAlertSuccessShow] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(url);
            const data = await resposta.json();
            setProfessores(data);
        }

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalShow(false);

        const professor = {
            nome: nome,
            email: email
        }

        if (isCadastro) {
            handleCreate(professor)
        } else {
            handleUpdate(professor)
        }

        setAlertSuccessShow(true);

        setNome("");
        setEmail("");
    }

    const handleClickEditar = async (id) => {
        const resposta = await fetch(`${url}/${id}`);
        const data = await resposta.json();

        setNome(data.nome);
        setEmail(data.email);
        setIdProfessorEscolhido(id);

        setIsCadastro(false);
        setModalShow(true);
    }

    const handleClickExcluir = async (id) => {
        setIsCadastro(false);

        const permissionToDelete = await CheckPermissionToDeleteProfessor(id);

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
    }

    const handleClickCancelar = () => {
        setIsCadastro(false);
        setModalShow(false);

        setNome("");
        setEmail("");
        setIdProfessorEscolhido("");
    }

    const handleCreate = async (professor) => {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(professor)
        });

        const addedProfessor = await resposta.json();

        setProfessores((prevProfessores) => [...prevProfessores, addedProfessor]);
    }

    const handleUpdate = async (professor) => {
        const resposta = await fetch(`${url}/${idProfessorEscolhido}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(professor)
        });

        const updatedProfessor = await resposta.json();

        const updatedProfessores = professores.map((professor) => {
            if (professor.id === updatedProfessor.id) {
                return updatedProfessor;
            }
            else {
                return professor;
            }
        })

        setProfessores(updatedProfessores);
    }

    const handleDelete = async (id) => {
        const resposta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        if (resposta.ok) {
            setProfessores(professores.filter((professor) => professor.id !== id));
        }
    }

    return (
        <div>
            <Alert variant="danger" show={alertExcluirShow} onClose={() => setAlertExcluirShow(false)} dismissible>
                Não é possível excluir. O professor possui disciplinas relacionadas.
            </Alert>

            <Alert variant="success" show={alertSuccessShow} onClose={() => setAlertSuccessShow(false)} dismissible>
                Professor cadastrado/alterado com sucesso!
            </Alert>

            <table className='tableData'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {professores.map((professor) => (
                        <tr key={professor.id}>
                            <td>{professor.nome}</td>
                            <td>{professor.email}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleClickEditar(professor.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleClickExcluir(professor.id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button variant="outline-primary" size="lg" onClick={handleClickCadastrar} className='buttonCadastrar'>Cadastrar</Button>

            <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
                <ModalHeader className='modalHeader'>
                    <ModalTitle>{isCadastro ? "Cadastrar Professor" : "Editar Professor"}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={(e) => handleSubmit(e)} className='form'>
                        <label>Nome</label>
                        <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

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

export default Professores