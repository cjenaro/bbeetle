class WeekExercise < ApplicationRecord
  belongs_to :week
  belongs_to :exercise
  
  validates :reps, presence: true, numericality: { greater_than: 0 }
  validates :sets, presence: true, numericality: { greater_than: 0 }
  validates :exercise_id, uniqueness: { scope: :week_id }
end 