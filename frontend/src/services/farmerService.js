import api from "./api";

export const farmerService = {
    async getFarmerByEmail(farmer_email){
        return api.get(`/farmer/email/${farmer_email}`)
    }
};