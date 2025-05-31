class AddWeeklyProgressionToBlockExercises < ActiveRecord::Migration[8.0]
  def change
    # Remove the old single reps column
    remove_column :block_exercises, :reps, :integer
    
    # Add flexible weekly progression support
    add_column :block_exercises, :weeks_count, :integer, default: 1
    add_column :block_exercises, :weekly_reps, :json, default: {}
  end
end 