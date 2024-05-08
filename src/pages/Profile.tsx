import './Profile.scss';

function Perfil() {
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');

    if (dropDownButton != null && buttons != null) {
        for (const button of buttons) {
            button.addEventListener('click', event => {
                if (event.target != null) {
                    //@ts-ignore
                    dropDownButton.textContent = event.target.value;
                }
            });
        }
    }

    return (
        <>
            <h3>Perfil</h3>

            <h3>Descrição</h3>
            <p>Isto é um texto de exemplo</p>

            <h3>Nome de utilizador</h3>

            <h3>Email</h3>

            <h3>Password</h3>
        </>
    );
}

export default Perfil;
