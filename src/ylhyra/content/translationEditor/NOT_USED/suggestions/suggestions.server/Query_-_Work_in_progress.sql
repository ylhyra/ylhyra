SELECT 'xx' as item_id, definition, definition_hash FROM (
	SELECT
		definitions.definition_hash,
		definitions.definition,

		# CONTAINS EVERYTHING IN DEFINITION
		(
			# REQUIRED NUMBER OF MATCHES
			SELECT count(*) FROM words_in_translation_frame
				WHERE translation_frame_hash = t.translation_frame_hash
					AND is_part_of_definition = TRUE
		) = (
			# AMOUNT OF MATCHES
			SELECT count(*) FROM words_in_translation_frame
				WHERE translation_frame_hash = t.translation_frame_hash
					AND is_part_of_definition = TRUE
					AND ((
						word = "náðu"
						AND position_relative_to_center_word = -1
					) OR (
						word = "ferðinni"
						AND position_relative_to_center_word = -2
					))
		) as HAS_CORRECT_AMOUNT_OF_MATCHES,

		# SCORE
		(
			SELECT SUM(10 - ABS(position_relative_to_center_word))
				FROM words_in_translation_frame
				WHERE translation_frame_hash = t.translation_frame_hash
					AND ((
						word = "náðu"
						AND position_relative_to_center_word = -1
					) OR (
						word = "ferðinni"
						AND position_relative_to_center_word = -2
					))
		) as SCORE

		FROM words_and_sentences
		JOIN translation_frames as t
			ON words_and_sentences.translation_frame_hash = t.translation_frame_hash
		JOIN definitions
			ON t.definition_hash = definitions.definition_hash
		WHERE text_hash = "671bt0"
		HAVING HAS_CORRECT_AMOUNT_OF_MATCHES = TRUE
		ORDER BY SCORE
	) as inner_table
GROUP BY definition_hash;
