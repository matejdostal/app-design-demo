const { useState, useEffect } = React;

const CreateHeader = () => {
    return (
        <header className="bg-dark text-white navbar">
            <div className="container">
                <div className="">
                    <div className="searchbox">
                        <div class="form-outline" id="search-auto">
                            <input id="search-input" type="search" class="form-control" placeholder="Hladať" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

const CheckIfHeaderVisible = (prevValue) => {
    const navbar_element = document.getElementById('navbar');
    let scrollvalue = window.pageYOffset;
    if (scrollvalue < prevValue) {
        navbar_element.hidden = false;
    }
    else {
        prevValue = window.pageYOffset;
        if (navbar_element.hidden == false) {
            navbar_element.hidden = true;
        }
    }
}

const formatDate = (date) => {
    return ("| " + date + " |");
}

const ConatinerData = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetch("data.json")
            .then((response) => response.json())
            .then((vehicles) => {
                console.log(vehicles);
                setVehicles(vehicles);
            });
    }, []);
    return (
        <div className="container">
            {vehicles.map((vehicle) => {
                const fDate = formatDate(vehicle.state_dtime);
                return (
                    <div key={vehicle.vehicle_number} className="row justify-content-between item">
                        <div className="col vehicle-number">
                            <div className="rounded-circle vehicle-number-circle">
                                <a className="text-center vehicle-number-text">{vehicle.vehicle_number}</a>
                            </div>
                        </div>
                        <div className="col-6 item-info">
                            <div className="row ">
                                <div className="">{vehicle.current_stop_name}</div>
                                <div>{fDate}</div>
                            </div>
                        </div>
                    </div>
                );
        })}
       </div>
    );
}
   
const App = () => {
    return (
        <>
            {CreateHeader()}
            {ConatinerData()}
        </>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);