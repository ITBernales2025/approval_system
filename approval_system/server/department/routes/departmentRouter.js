import { Router } from "express"
const router = Router()
import { auth } from "../../../middleware/auth.js"
import { allDept, deleteDept, newDepartment, updateDept } from "../controllers/departmentController.js"
import { validateNewDepartment } from "../../../middleware/modelValidation.js"

router.post('/new-department', validateNewDepartment, newDepartment),
router.put('/update-department/:id', updateDept)
router.delete('/delete-department/:id', deleteDept)
router.get('/all-departments', allDept)

export {router as DepartmentRouter}