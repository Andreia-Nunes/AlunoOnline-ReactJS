import React, { useState, useEffect, useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert, ModalTitle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CheckPermissionToDeleteAluno } from '../components/CheckPermissionToDelete';

const url = "http://localhost:3000/alunos"

const Alunos = () => {

    const [alunos, setAlunos] = useState([]);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [curso, setCurso] = useState("");

    const [idAlunoEscolhido, setIdAlunoEscolhido] = useState("");

    const [isCadastro, setIsCadastro] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [alertExcluirShow, setAlertExcluirShow] = useState(false);
    const [alertSuccessShow, setAlertSuccessShow] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const resposta = await fetch(url);
            const data = await resposta.json();
            setAlunos(data);
        }

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalShow(false);

        const aluno = {
            nome: nome,
            email: email,
            curso: curso
        }

        if (isCadastro) {
            handleCreate(aluno);
        } else {
            handleUpdate(aluno)
        }

        setAlertSuccessShow(true);

        setNome("");
        setEmail("");
        setCurso("");
    }

    const handleClickEditar = async (id) => {
        const resposta = await fetch(`${url}/${id}`);
        const data = await resposta.json();

        setNome(data.nome);
        setEmail(data.email);
        setCurso(data.curso);
        setIdAlunoEscolhido(id);

        setIsCadastro(false);
        setModalShow(true);
    }

    const handleClickExcluir = async (id) => {
        setIsCadastro(false);

        const permissionToDelete = await CheckPermissionToDeleteAluno(id);

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
        setCurso("");
        setIdAlunoEscolhido("");
    }

    const handleCreate = async (aluno) => {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        });

        const addedAluno = await resposta.json();

        setAlunos((prevAlunos) => [...prevAlunos, addedAluno]);
    }

    const handleUpdate = async (aluno) => {
        const resposta = await fetch(`${url}/${idAlunoEscolhido}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        });

        const updatedAluno = await resposta.json();

        const updatedAlunos = alunos.map((aluno) => {
            if (aluno.id === updatedAluno.id) {
                return updatedAluno;
            }
            else {
                return aluno;
            }
        })

        setAlunos(updatedAlunos);
    }

    const handleDelete = async (id) => {
        const resposta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        if (resposta.ok) {
            setAlunos(alunos.filter((aluno) => aluno.id !== id));
        }
    }

    return (
        <div>
            <Alert variant="danger" show={alertExcluirShow} onClose={() => setAlertExcluirShow(false)} dismissible>
                Não é possível excluir. O aluno possui disciplinas relacionadas.
            </Alert>

            <Alert variant="success" show={alertSuccessShow} onClose={() => setAlertSuccessShow(false)} dismissible>
                Aluno cadastrado/alterado com sucesso!
            </Alert>

            <table className='tableData'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Curso</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno) => (
                        <tr key={aluno.id}>
                            <td>{aluno.nome}</td>
                            <td>{aluno.email}</td>
                            <td>{aluno.curso}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleClickEditar(aluno.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => handleClickExcluir(aluno.id)}>Excluir</Button>
                                <Link to={`/matricula-aluno/${aluno.id}`} style={{ textDecoration: 'none', color: 'inherit' }}><Button variant='success'>Matricular</Button></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Button variant="outline-primary" size="lg" onClick={handleClickCadastrar} className='buttonCadastrar'>Cadastrar</Button>

            <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
                <Modal.Header className='modalHeader'>
                    <ModalTitle>{isCadastro ? "Cadastrar Aluno" : "Editar Aluno"}</ModalTitle>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={(e) => handleSubmit(e)} className='form'>
                        <label>Nome</label>
                        <input type="text" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

                        <label>Email</label>
                        <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label>Curso</label>
                        <input type="text" name="curso" value={curso} onChange={(e) => setCurso(e.target.value)} required />

                        <input type="submit" value={isCadastro ? "Cadastrar" : "Salvar"} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClickCancelar}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Alunos