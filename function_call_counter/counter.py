import os
import sys
from ast import parse
from ast_manipulators import ModuleImporter, FunctionInserter
from output_dto import FunctionCallInfo, FunctionCallerInfoEncoder
from inspect import getargvalues, getsource, getframeinfo
from collections import defaultdict
import json
import importlib

func_calls = defaultdict(lambda: FunctionCallInfo())

def get_func_call_info(func, locals, caller_frame):
    
    # get a string representation of the current function call
    current_call_args = []
    for key in locals:
        current_call_args.append("{}={}".format(key, locals[key]))
    current_func_call = "{}({})".format(func.__name__, ", ".join(current_call_args))

    # get a string representation of the caller function
    caller_func_args = []
    caller_arg_vals = getargvalues(caller_frame)
    for key in caller_arg_vals.args:
        caller_func_args.append("{}={}".format(key, caller_arg_vals.locals[key]))
    caller_frame_info = getframeinfo(caller_frame)
    caller_func_call = "{}({})".format(caller_frame_info.function, ", ".join(caller_func_args))
    
    # update func_calls dictionary
    calling_lines = func_calls[current_func_call].callers[caller_func_call].lines
    if (not caller_frame_info.lineno in calling_lines):
        calling_lines.append(caller_frame_info.lineno)
    func_calls[current_func_call].callers[caller_func_call].times_called += 1
    func_calls[current_func_call].total_times_called += 1

if __name__ == "__main__":
    module_to_analyse = importlib.import_module("test_module")
    source_code = getsource(module_to_analyse)

    tree = parse(source_code)
    ModuleImporter().visit(tree)
    FunctionInserter().visit(tree)

    exec(compile(tree, filename='<ast>', mode='exec'))

    print(json.dumps(func_calls, indent=4, cls=FunctionCallerInfoEncoder))

    with open(os.path.join(sys.path[0], "func_calls.json"), 'w') as f:
        json.dump(func_calls, f, indent=4, cls=FunctionCallerInfoEncoder)