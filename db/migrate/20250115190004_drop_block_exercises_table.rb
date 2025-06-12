class DropBlockExercisesTable < ActiveRecord::Migration[8.0]
  def change
    drop_table :block_exercises do |t|
      t.integer :block_id, null: false
      t.integer :exercise_id, null: false
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
      t.index [:block_id], name: "index_block_exercises_on_block_id"
      t.index [:exercise_id], name: "index_block_exercises_on_exercise_id"
    end
  end
end 