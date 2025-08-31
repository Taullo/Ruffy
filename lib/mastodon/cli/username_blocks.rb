# frozen_string_literal: true

require 'concurrent'
require_relative 'base'

module Mastodon::CLI
  class UsernameBlocks < Base
    desc 'list', 'List blocked usernames'
    def list
      UsernameBlock.find_each do |entry|
        say(entry.username.to_s, :white)
      end
    end

    option :contains, type: :boolean
    desc 'add USERNAME...', 'Block username(s)'
    long_desc <<-LONG_DESC
      Blocking a username prevents users from signing up with that
      username. You can provide one or multiple usernames to the command.

      When the --contains option is given, the given usernames will be matched
      partially, e.g. blocking 'test' will result in 'testing' being blocked as well.
      Please be mindful of the Scunthorpe Problem when using this option.
    LONG_DESC
    def add(*usernames)
      fail_with_message 'No username(s) given' if usernames.empty?

      comparison = 'equals'
      comparison = 'contains' if options[:contains]

      skipped = 0
      processed = 0

      usernames.each do |username|
        if UsernameBlock.exists?(username: username)
          say("#{username} is already blocked.", :yellow)
          skipped += 1
          next
        end

        username_block = UsernameBlock.new(username: username, comparison: comparison)
        username_block.save!
        processed += 1
      end

      say("Added #{processed}, skipped #{skipped}", color(processed, 0))
    end

    desc 'remove USERNAME...', 'Remove username blocks'
    def remove(*usernames)
      fail_with_message 'No username(s) given' if usernames.empty?

      skipped = 0
      processed = 0
      failed = 0

      usernames.each do |username|
        entry = UsernameBlock.find_by(username: username)

        if entry.nil?
          say("#{username} is not yet blocked.", :yellow)
          skipped += 1
          next
        end

        result = entry.destroy

        if result
          processed += 1
        else
          say("#{username} could not be unblocked.", :red)
          failed += 1
        end
      end

      say("Removed #{processed}, skipped #{skipped}, failed #{failed}", color(processed, failed))
    end

    private

    def color(processed, failed)
      if !processed.zero? && failed.zero?
        :green
      elsif failed.zero?
        :yellow
      else
        :red
      end
    end
  end
end
