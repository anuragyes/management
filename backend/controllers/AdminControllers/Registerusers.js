import Student from "../../models/Adminmodel/Registeruser.js"

export const registerStudent = async (req, res) => {
    try {
        const { rollnumber, name, password, email } = req.body;

        // console.log(req.body);
        // 1️ Validation
        if (!rollnumber || !name || !password || !email) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2️ Check if rollnumber already exists

        const existingStudent = await Student.findOne({
            $or: [{ rollnumber }, { email }]
        });

        if (existingStudent) {
            return res.status(400).json({
                message: "Roll number already registered"
            });
        }



        // 3️ Create student
        const student = new Student({
            rollnumber,
            name,
            password,
            email,
        });

        await student.save();

        // 4️ Response (never send password)
        res.status(201).json({
            message: "Student registered successfully",
            student: {
                id: student._id,
                rollnumber: student.rollnumber,
                name: student.name,
                email: student.email,
            }
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


