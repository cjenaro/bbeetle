class ExercisesController < ApplicationController
  before_action :require_authentication
  before_action :require_teacher
  
  inertia_share do {
    user: {
      email_address: Current.user.email_address,
      id: Current.user.id
    }
  } 
  end

  def index
    @exercises = Exercise.all
    render inertia: 'exercises/index', props: { exercises: @exercises.map { |e| e.as_json.merge(media_url: e.media.attached? ? url_for(e.media) : nil) } }
  end

  def show
    @exercise = Exercise.find(params[:id])
    render inertia: 'exercises/show', props: {
      exercise: @exercise.as_json.merge(
        media_url: @exercise.media.attached? ? url_for(@exercise.media) : nil
      )
    }
  end

  def new
    render inertia: 'exercises/new'
  end

  def create
    @exercise = Exercise.new(exercise_params)
    @exercise.media.attach(params[:exercise][:media]) if params[:exercise][:media]
    if @exercise.save
      redirect_to exercises_path
    else
      render inertia: 'exercises/new', props: { errors: @exercise.errors.full_messages }
    end
  end

  def edit
    @exercise = Exercise.find(params[:id])
    render inertia: 'exercises/edit', props: {
      exercise: @exercise.as_json.merge(
        media_url: @exercise.media.attached? ? url_for(@exercise.media) : nil
      )
    }
  end

  def update
    @exercise = Exercise.find(params[:id])
    @exercise.media.attach(params[:exercise][:media]) if params[:exercise][:media]
    if @exercise.update(exercise_params)
      redirect_to exercises_path
    else
      render inertia: 'exercises/edit', props: {
        exercise: @exercise.as_json.merge(
          media_url: @exercise.media.attached? ? url_for(@exercise.media) : nil
        ),
        errors: @exercise.errors.full_messages
      }
    end
  end

  def destroy
    @exercise = Exercise.find(params[:id])
    @exercise.destroy
    redirect_to exercises_path
  end

  private

  def exercise_params
    params.require(:exercise).permit(:name, :description)
  end
end
