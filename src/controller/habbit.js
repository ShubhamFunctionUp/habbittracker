const Habbit = require('../model/habbitSchema');
const catchAsync = require('express-async-handler');

const createHabbit = async(req,res)=>{
    const habbit = await Habbit.create(req.body);
    res.status(201).json({status:'Success',data:habbit})
}


const getMyHabbits = async(req,res)=>{
    const habits = Habbit.find({user:req.user._id})


    res.status(201).json({
        status:'sucess',
        data:habits
    })
}

const getAllHabts = catchAsync(async(req,res)=>{
    const habbits = await Habbit.find({});

    res.status(200).json({
        status:'sucess',
        data:habbits
    })
})

const getSingleHabit = catchAsync(async(req,res)=>{
    const habit = await Habbit.findById(req.params.id);

    res.status(201).json({
        status:'success',
        data:habit
    })
})

const updateCheckList = catchAsync(async(req,res)=>{
    const {habitId,checked} = req.body
    await Habbit.updateOne({ 'doAtTime.0.data': { $elemMatch: { _id: habitId } } }, { $set: { 'doAtTime.0.data.$.checked': checked } });

    res.status(204).json({
        status: 'success',
        message: 'Updated successfully.'
    });

})
module.exports.updateCheckList = updateCheckList

module.exports.getSingleHabit = getSingleHabit
module.exports.getAllHabts = getAllHabts
module.exports.createHabbit = createHabbit
module.exports.getMyHabbits = getMyHabbits