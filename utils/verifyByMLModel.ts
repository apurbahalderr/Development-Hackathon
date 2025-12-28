
import { Responder } from "@/models/responder.model";
import { Report } from "@/models/report.model";

const departmentMapping: Record<string, string> = {
    "Fire": "Fire Department",
    "Accident": "Traffic Police",
    "Medical": "Health Department",
    "Crime": "Police Department",
    "Disaster": "Disaster Management",
    "Infrastructure Collapse": "Public Works Department",
    "Other": "General",
    "Emergency": "Emergency Response"
};

export default async function verifyByMLModel(
    reportId: string,
    image: string | undefined, 
    severity: string, 
    type: string, 
    location: { lat: number; lng: number }, 
    description: string
) {
    // 1. Call ML Model (Mocked for now)
    // In a real scenario, you would send the image and description to a Python/Flask/FastAPI service
    // const mlResponse = await fetch('http://ml-service/predict', { ... });
    // const { verifiedType, verifiedSeverity, confidence } = await mlResponse.json();
    
    // Mocking ML logic:
    // Assume the ML model trusts the user input but might upgrade severity based on keywords
    let verifiedType = type;
    let verifiedSeverity = severity;
    

    //FIXME: Severity will also be predicted by ML model based on image and description
    const criticalKeywords = ["fire", "blood", "explosion", "dead", "collapse"];
    if (criticalKeywords.some(word => description.toLowerCase().includes(word))) {
        verifiedSeverity = "high";
    }

    const department = departmentMapping[verifiedType];
    
    const nearestResponder = await Responder.findOne({
        department: department,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [location.lng, location.lat]
                }
            }
        }
    });

    const updateData: any = {
        severity: verifiedSeverity,
        type: verifiedType,
        status: "assigning"
    };

    if (nearestResponder) {
        updateData.$push = { responderId: nearestResponder._id };
    }

    await Report.findByIdAndUpdate(reportId, updateData);

    return {
        verified: true,
        assignedResponder: nearestResponder ? nearestResponder.name : null
    };
 }