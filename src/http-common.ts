import axios from "axios";

export default axios.create({
    baseURL: "https://stromae-edt.demo.insee.io/api",
    headers: {
        "Content-type": "application/json",
    },
});
