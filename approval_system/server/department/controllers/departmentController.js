import Department from "../../../model/Department.js"
import asyncHandler from "../../../middleware/asyncHandler.js"
import User from "../../../model/User.js"

//add department 
export const newDepartment = asyncHandler(async(req, res, next) => {
  const {name, aom} = req.body
  const aomAccount = await User.findOne({name: aom.toLowerCase()})
  if(!aomAccount) return res.status(404).json({message: "AOM account not found"})

  try {
    await Department.create({name: name, aom: aomAccount._id})
    return res.status(200).json({message: "New Dept"})
  } catch (error) {
    next(error)
  }
})

//update department
export const updateDept = asyncHandler(async (req, res, next) => {
  const {id} = req.params
  const {name,aom} = req.body
  const aomAccount = await User.findOne({name: aom})
  if(!aomAccount) return res.status(404).json({message: "AOM account not found"})
  try {
    const updateDept = await Department.findByIdAndUpdate(id, {name: name, aom: aomAccount._id})
    if(!updateDept) return res.status(404).json({message: "Department not found"})
    return res.status(200).json({message: "Department successfully udate"})
  } catch (error) {
    next(error)
  }
})

//delete department
export const deleteDept = asyncHandler(async (req, res, next) => {
  const {id} = req.params
  try {
    const deleteDept = await Department.findByIdAndDelete(id)
    if(!deleteDept) return res.status(404).json({message: "Department not found"})
    return res.status(200).json({message: "Department successfully deleted"})
  } catch (error) {
    next(error)
  }
})

//all department
export const allDept = asyncHandler(async (req, res, next) => {
  try {
    const departments = await Department.find().sort({field: 'asc', name: 1}).populate('aom')
    return res.status(200).json(departments)
  } catch (error) {
    next(error)
  }
})