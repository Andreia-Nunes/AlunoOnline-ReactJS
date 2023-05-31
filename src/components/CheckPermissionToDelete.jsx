
export async function CheckPermissionToDeleteAluno(id) {

    const url = "http://localhost:3000/matriculas";

    const resposta = await fetch(url);
    const matriculas = await resposta.json();

    const matriculaAluno = matriculas.find((matricula) => matricula.aluno == id);

    if (matriculaAluno == null) {
        return true;
    }
    else {
        return false;
    }
}

export async function CheckPermissionToDeleteProfessor(id) {

    const url = "http://localhost:3000/disciplinas";

    const resposta = await fetch(url);
    const disciplinas = await resposta.json();

    const disciplinaProfessor = disciplinas.find((disciplina) => disciplina.professor == id);

    if (disciplinaProfessor == null) {
        return true;
    }
    else {
        return false;
    }
}

export async function CheckPermissionToDeleteDisciplinas(id) {

    const url = "http://localhost:3000/matriculas";

    const resposta = await fetch(url);
    const matriculas = await resposta.json();

    const matriculasDisciplina = matriculas.find((matricula) => matricula.disciplina == id);

    if (matriculasDisciplina == null) {
        return true;
    }
    else {
        return false;
    }
}
