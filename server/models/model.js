
  // QR Schema
  const QRSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'snacks', 'dinner']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  });
  

  
  // Redemption - Records when a staff member redeems a shared meal
  
  const RedemptionSchema = new mongoose.Schema({
    mealSharing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MealSharing',
      required: true
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    notes: {
      type: String
    }
  });
  
