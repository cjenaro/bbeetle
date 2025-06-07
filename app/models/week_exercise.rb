class WeekExercise < ApplicationRecord
  belongs_to :week
  belongs_to :exercise
  
  validates :reps, presence: true, numericality: { greater_than: 0 }
  validates :sets, presence: true, numericality: { greater_than: 0 }
  validates :exercise_id, uniqueness: { scope: :week_id }
  
  # Ensure the exercise is actually assigned to this block
  validate :exercise_must_be_in_block, on: :update
  
  private
  
  def exercise_must_be_in_block
    return unless week&.block&.persisted? && exercise
    
    unless week.block.block_exercises.exists?(exercise: exercise)
      errors.add(:exercise, "must be assigned to this block first")
    end
  end
end 