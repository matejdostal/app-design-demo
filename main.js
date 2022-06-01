const { useState, useEffect } = React;

const CreateHeader = () => {
    return (
        <header>
            <nav className="bg-dark text-white navbar navbar-expand-lg">
                <div className="container-fluid justify-content-center">
                    <div className="searchbox p-2 col-lg nav-item">
                        <div class="form-outline" id="search-auto">
                            <input id="search-input" type="search" class="form-control" placeholder="Hladať" />
                        </div>
                    </div>
                </div>
            </nav>
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

const ParseTime = (timestring) => {
    const d = new Date(timestring);
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();

    return ((h*3600) + (m*60) + (s));
}

const IconBackground = (vehicle) => {
    const isOnline = vehicle.online;

    if (vehicle.errors !== null && vehicle.errors.lenght > 0) {
        return ("bg-vehicle-error ");
    }
    else if (isOnline == false) {
        return ("bg-vehicle-offline ");
    }
    else if (isOnline == true && vehicle.time_difference !== null) {
        if (ParseTime(vehicle.time_difference) > ParseTime("00:01:00")) {
            return ("bg-vehicle-late ");
        }
        else {
            return ("bg-vehicle-online ");
        }
    }
    else {
        return ("bg-vehicle-online ");
    }
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
        <div className="container dataroot">
            {vehicles.map((vehicle) => {
                const fDate = formatDate(vehicle.state_dtime);
                return (
                    <div key={vehicle.vehicle_number} className="d-flex align-items-center p-3 my-3 item">
                        <div className={
                            IconBackground(vehicle) +
                            " justfiy-content-start vehicle-number"
                            }>
                            <div className="rounded-circle bd-placeholder vehicle-number-circle">
                                <a className="text-center vehicle-number-text" href="#">{vehicle.vehicle_number}</a>
                            </div>
                        </div>
                        <div className="item-info">
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
