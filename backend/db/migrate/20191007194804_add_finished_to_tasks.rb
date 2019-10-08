class AddFinishedToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :finished, :boolean
  end
end
