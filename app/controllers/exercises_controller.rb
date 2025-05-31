class ExercisesController < ApplicationController
  before_action :require_authentication
  before_action :require_teacher
  
  # Add file size limit (50MB)
  MAX_FILE_SIZE = 50.megabytes
  
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
    
    if params[:exercise][:media].present?
      media_file = params[:exercise][:media]
      
      # Validate file size
      if media_file.size > MAX_FILE_SIZE
        @exercise.errors.add(:media, "File too large. Maximum size is #{MAX_FILE_SIZE / 1.megabyte}MB")
        render inertia: 'exercises/new', props: { errors: @exercise.errors.full_messages }
        return
      end
      
      # Process and compress the file
      processed_file = process_media_file(media_file)
      @exercise.media.attach(processed_file) if processed_file
    end
    
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
    
    if params[:exercise][:media].present?
      media_file = params[:exercise][:media]
      
      # Validate file size
      if media_file.size > MAX_FILE_SIZE
        @exercise.errors.add(:media, "File too large. Maximum size is #{MAX_FILE_SIZE / 1.megabyte}MB")
        render inertia: 'exercises/edit', props: {
          exercise: @exercise.as_json.merge(
            media_url: @exercise.media.attached? ? url_for(@exercise.media) : nil
          ),
          errors: @exercise.errors.full_messages
        }
        return
      end
      
      # Process and compress the file
      processed_file = process_media_file(media_file)
      @exercise.media.attach(processed_file) if processed_file
    end
    
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

  def delete_media
    @exercise = Exercise.find(params[:id])
    @exercise.media.purge if @exercise.media.attached?
    redirect_to edit_exercise_path(@exercise)
  end

  private

  def exercise_params
    params.require(:exercise).permit(:name, :description)
  end
  
  def process_media_file(file)
    return file unless file.respond_to?(:content_type)
    
    case file.content_type
    when /^image\//
      process_image(file)
    when /^video\//
      process_video(file)
    else
      file
    end
  end
  
  def process_image(file)
    return file unless file.respond_to?(:tempfile)
    
    begin
      # Resize and compress image to max 1920px width/height, 85% quality
      processed = ImageProcessing::MiniMagick
        .source(file.tempfile)
        .resize_to_limit(1920, 1920)
        .convert("jpg")
        .saver(quality: 85)
        .call
      
      # Create new uploaded file object
      ActionDispatch::Http::UploadedFile.new(
        tempfile: processed,
        filename: "#{File.basename(file.original_filename, '.*')}.jpg",
        type: "image/jpeg"
      )
    rescue => e
      Rails.logger.error "Image processing failed: #{e.message}"
      file # Return original if processing fails
    end
  end
  
  def process_video(file)
    # For videos, just validate size for now
    # You could add ffmpeg processing here if needed
    if file.size > 10.megabytes
      Rails.logger.warn "Large video file uploaded: #{file.size} bytes"
    end
    file
  end
end
