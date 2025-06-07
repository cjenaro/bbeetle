class CreateWeeks < ActiveRecord::Migration[8.0]
  def change
    create_table :weeks do |t|
      t.references :block, null: false, foreign_key: true
      t.integer :week_number, null: false
      t.timestamps
    end
    
    add_index :weeks, [:block_id, :week_number], unique: true
  end
end 