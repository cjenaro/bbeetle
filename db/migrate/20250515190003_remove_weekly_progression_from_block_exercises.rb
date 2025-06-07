class RemoveWeeklyProgressionFromBlockExercises < ActiveRecord::Migration[8.0]
  def change
    remove_column :block_exercises, :weeks_count, :integer
    remove_column :block_exercises, :weekly_reps, :json
    remove_column :block_exercises, :sets, :integer
  end
end 