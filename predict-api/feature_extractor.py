import string
import re

class FeatureExtractor:
    def __init__(self, payload_list):
        self.payload_list = [p.translate({ord(c): None for c in string.whitespace}) for p in payload_list]

    def extract_features(self, query):
        temp_query = query.translate({ord(c): None for c in string.whitespace})

        # Feature 1: Contains Empty String
        def contains_empty_string(query):
          return int("\"\"" in query or "''" in query)

        # Feature 2: Contains Injection Payload
        def contains_injection_payload(query):
          return int(any(p in temp_query for p in self.payload_list))

        # Feature 3: Contains Comparison
        def contains_comparison(query):
          condition = [
            "find(", "$selector", "find.sort(", "$eq", "$gt", "$gte",
            "$ne", "$lt", "$lte", "$nin"
          ]    
          first_check = any(c in query for c in condition)
          
          # this is for $in operator because basic check will include $inc as well
          pattern = r'\$in\b\s*:'
          second_check = bool(re.search(pattern, query))
          
          return int(first_check or second_check)

        # Featute 4: Contains Logical Operator
        def contains_logical_operator(query):
          return int(any(op in query for op in ["$or", "$and", "$not", "$nor"]))

        # Feature 5: Contains Evaluation Query Operation
        def contains_evaluation_query_operation(query):
          return int(any(op in temp_query for op in ["$mod", "$regex", "$text", "$where"]))

        # Feature 6: Presence of return
        def contains_return(query):
          return int(";return" in query or "return 1" in query or "return true" in query or "return(true)" in query)

        # Feature 7: New Query
        def is_new_query(query):
          return int(";db." in query)

        # Feature 8: Contains Always True Expression (regex-based attack)
        def contains_regex_true(query):
          return int(any(r in temp_query for r in ["/.*/", "/./", "/."]))

        # Feature 9: Contains Element Query Operations
        def contains_element_query_operations(query):
          return int(any(op in temp_query for op in ["$exists", "$type"]))

        # Feature 10: Contains Null comparison
        def contains_null_comparison(query):
          return int("null" in query)

        # Feature 11: Alters Collection
        def does_alter_collection(query):
          # return int("createCollection(" in query or "drop(" in query)
          return int(any(op in query for op in ["createCollection(", "drop(", "createTable()", "showTable()"]))

        # Feature 12: Drop Database
        def does_drop_database(query):
          return int("dropDatabase(" in query)

        # Feature 13: Update Query
        def does_update_query(query):
          return int(any(op in query for op in ["update(", "save("]))

        # Feature 14: Contain Remove Query
        def does_remove_query(query):
          return int("remove(" in query)

        # Feature 15: Contain Limit Keyword
        def contain_limit(query):
          return int("limit" in query)

        # Feature 16: Infinite Loop
        def is_while_true(query):
          return int("while(true)" in query)

        features = [
            contains_empty_string(query),
            contains_injection_payload(query),
            contains_comparison(query),
            contains_logical_operator(query),
            contains_evaluation_query_operation(query),
            contains_return(query),
            is_new_query(query),
            contains_regex_true(query),
            contains_element_query_operations(query),
            contains_null_comparison(query),
            does_alter_collection(query),
            does_drop_database(query),
            does_update_query(query),
            does_remove_query(query),
            contain_limit(query),
            is_while_true(query),
        ]
        return features