from json import JSONEncoder

class FunctionCall:
    def __init__(self, caller: str = None, lineno: int = 0, return_value = None):
        if caller is None:
            caller = "Null"
        self.caller = caller
        self.lineno = lineno
        self.return_value = return_value    

# this class allows us to use the json dumping functions
class FunctionCallerInfoEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__