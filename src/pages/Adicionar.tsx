import './Adicionar.scss';

function Adicionar() {
    const dropDownButton = document.querySelector('#dropdownHere');
    const buttons = document.querySelectorAll('.dropdown-item');

    for (const button of buttons) {
        button.addEventListener('click', event => {
            dropDownButton.textContent = event.target.value;
        });
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
                </ul>
            </div>
            <h3>Data</h3>
            <h3>Nº de lugares</h3>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                    Única vez
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todas as semanas
                </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                    Todos os dias
                </label>
            </div>
            <div className="dropdown">
                <button id="dropdownHere" className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown
                </button>
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" value="Boleias">
                            Segundas
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Terças
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Quartas
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Quintas
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" value="Viagens">
                            Sextas
                        </button>
                    </li>
                </ul>
                <button id="ButConf">Confimar</button>
                <a href="/Viagens">
                    <button id="ButCanc">Cancelar</button>
                </a>
            </div>
        </>
    );
}

export default Adicionar;
