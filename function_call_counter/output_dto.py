from typing import List, TypedDict
from collections import defaultdict
from json import JSONEncoder

class FunctionCallerInfo:
    def __init__(self, lines: List[int] = None, times_called: int = 0):
        if lines is None:
            lines = []
        self.lines = lines
        self.times_called = times_called

class FunctionCallInfo:
    def __init__(self, callers: TypedDict('Caller_info', {'caller' : str, 'info': FunctionCallerInfo}) = None, total_times_called: int = 0):
        if (callers is None):
            callers = defaultdict(lambda: FunctionCallerInfo())
        self.callers = callers
        self.total_times_called = total_times_called

class FunctionCallerInfoEncoder(JSONEncoder):
    # this class allows us to use the json dumping functions
    def default(self, o):
        return o.__dict__