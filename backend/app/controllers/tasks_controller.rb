class TasksController < ApplicationController

  def index
    tasks = Task.all
    render json: tasks
  end

  def update
    task = Task.find(params[:id ])
    if task.update(finished: params[:finished])
      render json: task
    end
  end

end
