import { Router } from "express"
import { allBranches, deleteBranch, newBranch } from "../controllers/branchController.js"
import { auth } from "../../../middleware/auth.js"
import { validateNewBranch } from "../../../middleware/modelValidation.js"
const router = Router()

router.post('/create', validateNewBranch,newBranch)
router.delete('/delete/:id', deleteBranch)
router.get('/branches', allBranches)

export {router as BranchRouter}