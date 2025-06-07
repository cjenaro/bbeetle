class BlockExercise < ApplicationRecord
  belongs_to :block
  belongs_to :exercise
  
  validates :exercise_id, uniqueness: { scope: :block_id }
  
  # This model defines which exercises are available in a block
  # The actual reps/sets for each week are stored in WeekExercise
end
