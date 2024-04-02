# frozen_string_literal: true

module WordmarkHelper
  def wordmark_url
    full_asset_url(instance_presenter.wordmark&.file&.url || asset_pack_path('media/images/wordmark.png'))
  end

  def instance_presenter
    @instance_presenter ||= InstancePresenter.new
  end
end
