class CreateWeekExercises < ActiveRecord::Migration[8.0]
  def change
    create_table :week_exercises do |t|
      t.references :week, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :reps, null: false
      t.integer :sets, null: false
      t.timestamps
    end
    
    add_index :week_exercises, [:week_id, :exercise_id], unique: true
  end
end 