class CreateBlocks < ActiveRecord::Migration[8.0]
  def change
    create_table :blocks do |t|
      t.references :day, null: false, foreign_key: true
      t.string :title
      t.integer :position

      t.timestamps
    end
  end
end
