const mongoose = require('mongoose')    

const habitSchema =new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    doAtTiming:[
        {
            date:{
                type:Date,
                default:Date.now()
            },
            data:[
                {
                    checked:{
                        type:Boolean,
                        default:false
                    },
                    time:String
                }
            ],
            _id:false
        }
    ],
    doAtPlace:{
        type:String,
        required:true
    },
    dailyTarget:{
        type:Number
    },
    dailyTargetUnit:{
        type:String

    },
    reminder:{
        type:Boolean
    }
            




},
{ 
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
}
)

habitSchema.virtual('averageGoal').get(()=>{
    return this.dailyTarget / this.doAtTiming.length
})

module.exports = mongoose.model('habit',habitSchema)