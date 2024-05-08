import './Historic.scss';

function Viagens() {
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
            <div className="dropdown">
                <button id="dropdownHere" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" value="Boleias">
                            Boleias
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Viagens
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Os meus pedidos de boleia">
                            Os meus pedidos de boleia
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="As minhas viagens">
                            As minhas viagens
                        </button>
                    </li>
                </ul>
            </div>
            <ul id="ListGroup" className="list-group">
                <li className="list-group-item" aria-current="true">
                    An active item
                </li>
                <li className="list-group-item">A second item</li>
                <li className="list-group-item">A third item</li>
                <li className="list-group-item">A fourth item</li>
                <li className="list-group-item">And a fifth one</li>
            </ul>
        </>
    );
}

export default Viagens;
