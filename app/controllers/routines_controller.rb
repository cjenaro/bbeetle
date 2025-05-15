class RoutinesController < ApplicationController
  before_action :require_authentication, except: [:show, :active]
  before_action :require_teacher, except: [:show, :active]
  before_action :resume_session, only: [:show, :active] # add user but do not require it
  
  inertia_share do {
    user: {
      email_address: Current.user.email_address,
      id: Current.user.id
    }
  } if Current.user.present?
  end

  def index
    routines = Routine.includes(days: { blocks: :block_exercises }).all
    render inertia: 'routines/index', props: { routines: routines }
  end

  def show
    routine = Routine.includes(days: { blocks: :block_exercises }).find(params[:id])
    render inertia: 'routines/show', props: {
      routine: routine_with_nested(routine)
    }
  end

  def new
    render inertia: 'routines/new', props: {
      exercises: Exercise.all
    }
  end

  def edit
    routine = Routine.includes(days: { blocks: :block_exercises }).find(params[:id])
    render inertia: 'routines/edit', props: {
      routine: routine_with_nested(routine),
      exercises: Exercise.all
    }
  end

  def update
    routine = Routine.find(params[:id])
    if routine.update(routine_params)
      redirect_to routine_path(routine)
    else
      render inertia: 'routines/edit', props: {
        routine: routine_with_nested(routine),
        exercises: Exercise.all
      }
    end
  end

  def create
    routine = Routine.new(routine_params)
    if routine.save
      redirect_to routine_path(routine)
    else
      render inertia: 'routines/new', props: { errors: routine.errors }
    end
  end
  
  def destroy
    routine = Routine.find(params[:id])
    routine.destroy
    redirect_to routines_path
  end

  def activate
    Routine.update_all(is_active: false)
    routine = Routine.find(params[:id])
    routine.update(is_active: true)
    redirect_to routines_path
  end

  def active
    routine = Routine.find_by(is_active: true)
    if routine
      redirect_to routine_path(routine)
    else
      redirect_to routines_path, alert: "No active routine found."
    end
  end

  private

  def routine_params
    permitted = params.permit(
      :title, :description, :is_active,
      days: [
        :id, :name, :_destroy,
        blocks: [
          :id, :title, :_destroy,
          block_exercises: [:id, :exercise_id, :sets, :reps, :_destroy]
        ]
      ]
    ).to_h

    deep_transform_keys_for_nested_attributes!(permitted)
    permitted
  end

  def deep_transform_keys_for_nested_attributes!(hash)
    if hash.is_a?(Array)
      hash.each { |item| deep_transform_keys_for_nested_attributes!(item) }
    elsif hash.is_a?(Hash)
      hash.keys.each do |key|
        value = hash[key]
        if key.to_s == "days"
          hash["days_attributes"] = hash.delete("days")
          deep_transform_keys_for_nested_attributes!(hash["days_attributes"])
        elsif key.to_s == "blocks"
          hash["blocks_attributes"] = hash.delete("blocks")
          deep_transform_keys_for_nested_attributes!(hash["blocks_attributes"])
        elsif key.to_s == "block_exercises"
          hash["block_exercises_attributes"] = hash.delete("block_exercises")
          deep_transform_keys_for_nested_attributes!(hash["block_exercises_attributes"])
        else
          deep_transform_keys_for_nested_attributes!(value)
        end
      end
    end
  end

  def routine_with_nested(routine)
    routine.as_json(
      include: {
        days: {
          include: {
            blocks: {
              include: {
                block_exercises: {
                  include: :exercise
                }
              }
            }
          }
        }
      }
    )
  end
end
