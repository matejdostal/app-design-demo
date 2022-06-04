const { useState, useEffect } = React;


/**
 * TODO:
 *  online
 * state_dtime
 * ide na cas
 */
/****************************************************************************************/
/*     Header - just for looks, so I know what it will probably look like normally      */
/****************************************************************************************/
const HeaderFunction = () => {
    const [elementState, newState] = useState(0);
    //const y = ReactDOM.createRoot(getElementById(''));
    useEffect( () => {
        
    });

    return (
        <header className="overflow-hidden">
            <nav className="bg-dark text-white navbar navbar-expand-lg">
                <div className="container-fluid justify-content-center">
                    <div className="searchbox p-2 nav-item">
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

/****************************************************************************************/
/*                                  CONSTANTS TO CHANGE                                 */
/****************************************************************************************/
const VehicleTypes = {
    bus: "Autobus",
    trolleybus: "Trolejbus",
    train: "Vlak",
    unknown: "Neznámy"
};

const translateType = (vehicle_type) => {
    switch (vehicle_type) {
        case "bus":
            return VehicleTypes.bus;
        case "trolleybus":
            return VehicleTypes.trolleybus;
        case "train":
            return VehicleTypes.train;
        default:
            return VehicleTypes.unknown;
    }
};

const tripStateValue = {
    idle : "IDLE",
    on_the_way : "HEADING_TO_NEXT_STATION",
    departure : "DEPARTURE",
    arrival : "ARRIVAL",
    none : null
};

const stateValue = {
    meskanie: "Meskanie o: ",
    nadbieha: "Nadbieha o: ",
    okay: "Ide na cas: ",
    none: null
};

const TimeDifferenceNeededForLate = "00:01:00";

/***************************************************************************************/
/*                                                                                     */
/***************************************************************************************/

const tripIndicator = (tripstatus) => {
    let st;
    switch (tripstatus) {
        case tripStateValue.on_the_way:
            st= " On the way ";
            break;
        case tripStateValue.idle:
            st = " Idle ";
            break;
        case tripStateValue.arrival:
            st = " Arriving ";
            break;
        case tripStateValue.departure:
            st = " Departing ";
            break;
        default:
            st = " Unknown "
    }
    return st;
    /*return (
        <span className="position-relative">
            <div className={"rounded-circle position-absolute top-0 start-50 translate-middle border trip-statusindicator p-1 align-items-end" + st}/>
        </span>
    );*/
}

const vehLineBadge = (vehline, type) => {
    return (
        <span className={" px-2 align-self-center vehicle-line-badge-"+ type + " "}>
            <span className="vehicle-line text-center">
                {vehline}
            </span>
        </span>
    );
};

/**
 * Creates and returns an HTML representaion of the item header information.  
 * The header information is:
 * - the line_number 
 *   - with a background color appropiate for the vehicle type 
 * - current stop
 *   - next stop if found
 * - vehicle_number
 *   - with a background color according to the `timeDifference`
 * @param {Vehicle} vehicle 
 * @returns {HTML} `html`
 */
const typeBadge = (vehicle) => {
    let text, state = null;
    switch (vehicle.trip_status) {
        case tripStateValue.on_the_way:
            text = (vehicle) => {
                return (vehicle.current_stop_name + " 🠖 NEXT_STOP");
            };
            state = tripStateValue.on_the_way;
            break;
        case tripStateValue.arrival:
            text = (vehicle) => {
                return (vehicle.current_stop_name + " 🠖 " + vehicle.destination_stop_name);
            }
            state = tripStateValue.arrival;
            break;
        case tripStateValue.departure:
            text = (vehicle) => {
                return (vehicle.current_stop_name + " 🠖 " + "NEXT_STOP");
            }
            state = tripStateValue.departure;
            break;
        case tripStateValue.idle:
            text = (vehicle) => {
                return (vehicle.current_stop_name);
            }
            state = tripStateValue.idle;
            break;
        default:
            return null;
    }

    return (
        <>
            <div className={
                    "status-" + IconBackground(vehicle) +
                    "rounded-3 vehicle-link-status d-flex flex-cloumn bg-opacity-10  pe-1 text-wrap"
                }>
                <div className={"vehicle-trip-type position-relative d-inline-flex flex-nowrap flex-fill "}>
                    <div className="d-flex flex-grow-1 align-self-center">
                        <div className={
                            IconBackground(vehicle) + 
                            "border border-1 rounded-1 d-flex text-center p-1 px-2 align-items-center"
                            } >
                                <span className="vehicle-number-text">
                                {vehicle.vehicle_number}
                                </span>
                        </div>
                        <div className="ms-2 align-self-center p-1">
                        {
                            text(vehicle)
                        }
                        </div>
                    </div>
                    {
                        vehLineBadge(vehicle.line_name,vehicle.vehicle_type)
                    }
                </div>                
            </div>
        </>
    );
}
/**
 * A function that parses an "HH:mm:ss" formatted
 * time given in string into an integer that represents
 * the sum of the given time in seconds.
 * @param {String} timestring 
 * @returns {Int} `seconds`
 */
const parseTime = (timestring) => {
    if (timestring === undefined || timestring === null) return undefined;
    let time = timestring.match( /(-?[0-9][0-9]:[0-9][0-9]:[0-9][0-9])/g );
    if (time !== null) {
        // a timestring containing 2 times is not possible/ it's neglibable to just not parse them
        if (time.length > 1) return ErrorEvent;

        const s = time.toString().match(/[-]/g); // find negative symbol
        const g = time.toString().split(':');
        g.forEach( (element, index, parsed) => {
            parsed[index] = parseInt(element);
        });

        if (s === null) {
            return ((g[0]*3600) + (g[1]*60) + (g[2]));
        }
        else {
            const val = ((g[0]*3600) + (g[1]*60) + (g[2]));
            return (val < 0 ? val : val *(-1) );
        }
    }

    return undefined;
}

/**
 * Returns an `Int` that represents if a vehicle is late or early by comparing `the time_difference` of a vehicle to the constat `TimeDifferenceNeededForLate`.  
 * 
 * **3 possible values**:  
 * `0` - `early`  
 * `1` - `late`  
 * `2` - `neither`
 * @param {Vehicle} vehicle 
 * @returns {Int} `0 | 1 | 2`
 */
const timeDifference = (vehicle) => {
    const td = parseTime(TimeDifferenceNeededForLate);
    const time_difference = parseTime(vehicle.time_difference);
    
    if (time_difference > 0 && time_difference > td) {
        return 0;
    }
    else if (time_difference < 0 && time_difference < -td) {
        return 1;
    }
    else {
        return 2;
    }
}

/**
 * Returns background color type (for `class` html tag).  
 * 
 * The colors for the particular string are beforehand declared in CSS.
 * @param {Object} vehicle 
 * @returns {String} `string`
 */
const IconBackground = (vehicle) => {
    const isOnline = vehicle.online;

    switch (timeDifference(vehicle)) {
        case 0:
            return ("bg-vehicle-early ");
        case 1:
            return ("bg-vehicle-late ");
        case 2:
            return ("bg-vehicle-okay ");
    }
}

/**
 * Returns the absolute value of time difference string as string.
 * The format must be `HH:mm:ss`.  
 * **It doesn't check the strings validity!!!**
 * @param {string} td 
 * @returns {String}
 */
const timeStrip = (td) => {
    if (td!== null) {
        if (td.match(/[-]/g) !== null) {
            return td.slice(1);
        }
        return td;
    }
    return "00:00:00";
}

const vehicleTripTimeStatus = (v) => {

}

/**
 * Creates the HTML represenation of a badge that displays the time difference when necessery.  
 * Displays either how late or how early a vehicle is using the time_difference data.
 * @param {Vehicle} vehicle 
 * @returns {HTML} 
 */
const timeDifferenceBadge = (vehicle) => {

    let m = null,txt = null;
    switch (timeDifference(vehicle)) {
        case 0:
            m = " td-nadbieha";
            txt = (stateValue.nadbieha + vehicle.time_difference);
            break;
        case 1:
            m = " td-meskanie";
            txt = (stateValue.meskanie + vehicle.time_difference.slice(1));
            break;
        case 2:
            m = " td-okay"
            txt = (stateValue.okay + timeStrip(vehicle.time_difference))
            break;
    }

    return (
        <div className={"mt-2 d-flex justify-content-end ms-auto " + m}>         
            <span className={"px-2 fs-6 td-text border border-1 rounded-pill " +m + "-text"}>
            {
                txt
            }
            </span>
        </div>
    );
}

const vehicleStatusText = (on) => {
    let f = null;
    if (on === true) {
        f = "Online";
    }
    else {
        f = "Offline";
    }
    return (
        <>
            <div className={"border border-1 shadow-sm status status-"+ f.toLowerCase()+" rounded-circle p-2 align-self-center me-2"}/>
            <span>{f}</span>            
        </>
    );
}

const vehicleMsgTime = (state_dtime) => {
    try {
        let dtime = new Date(state_dtime);

        let always = dtime.toTimeString();
        always = always.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g)
        let date = "", icon = "";
        console.log("dtime: " + dtime);
        const w = Math.abs(new Date() - new Date("January 01, 1970 00:01:00 UTC"));
        console.log(w +"; "+ dtime.getTime());
        if (dtime.getTime() <= w) {
            icon = "-old.svg";
        }
        else {
            icon = ".svg";
        }

        if ((new Date()).getDate() < dtime.getDate() ) {
            date = dtime.toLocaleDateString()
            icon = "-red.svg"
        }
        // slovensky format: d. M. YYYY HH:mm:ss
        return (
            <>
                <img src={"icons/clock"+icon} className={"me-2 state-dtime-icon "}/>
                <span className="state-dtime-text">
                    {
                        date + " " +always
                    }
                </span>
            </>
        );
    } 
    catch (error) {
        console.log((new Date()).toDateString() + error);
    }
}

/**
 * A function that returns a description about the particular vehicle.
 * @param {Vehicle} vehicle 
 * @returns {HTML}
 */
const vehicleInformation = (vehicle) => {
    if (vehicle.service_number !== null)
    {
        return (
            <>
                <div className="d-flex flex-column">
                    <div className="service-id d-flex align-items-center">
                        <img src="icons/notes.svg" className="service-id-icon justify-self-strech me-2" />
                        <span>
                            {vehicle.service_number}
                        </span>
                        
                    </div>
                    <div className="vehicle-status d-inline-flex">
                        {
                            vehicleStatusText(vehicle.online)
                        }
                    </div>
                    <div className="state-dtime d-inline-flex align-items-center">
                        {
                            vehicleMsgTime(vehicle.state_dtime)
                        }
                    </div>
                </div>
            </>
        );
    }
}
/**
 * Returns the items to be inserted into the container
 * @returns {HTML} 
 */
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
        <div className="container-fluid dataroot d-flex flex-column justify-content-center ">
            <div className="flex-grow-1">
                {vehicles.map((vehicle) => {
                    //const fDate = formatDate(vehicle.state_dtime);
                    let dostupny = "";
                    if (vehicle.line_name === null) {
                        return null;
                    }
                    else if (vehicle.online === false) {
                        dostupny = " bg-offline ";
                    }
                    if (timeDifference(vehicle) === 0) {

                        dostupny = " item-nadbieha ";
                    }
                    else if (timeDifference(vehicle) === 1) {
                        dostupny = " item-meska ";
                    }
                    return (
                        <a id={vehicle.vehicle_number} key={vehicle.vehicle_number} href={"#" + vehicle.vehicle_number} className={"d-flex border border-1 shadow-sm rounded-3 align-items-center m-2 my-3 item position-relative" + dostupny}>
                            <div className=" flex-fill d-flex flex-column item-info">
                                {
                                    typeBadge(vehicle)
                                }
                                <div className="flex-grow-1 d-flex flex-column pt-1 ps-1 mx-2 my-1">
                                    {
                                        vehicleInformation(vehicle)
                                    }
                                    {
                                        timeDifferenceBadge(vehicle)
                                    }
                                </div>
                            </div>
                        </a>
                    );
            })}
            </div>
        </div>
    );
}
   
const header = ReactDOM.createRoot(document.getElementById("header-part"));
const root = ReactDOM.createRoot(document.getElementById("root"));

header.render(<HeaderFunction />);
root.render(<ConatinerData />);
