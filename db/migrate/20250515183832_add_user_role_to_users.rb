class AddUserRoleToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :user_role, :integer, default: 0, null: false
  end
end
