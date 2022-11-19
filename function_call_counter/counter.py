import os
import sys
from ast import parse, fix_missing_locations
from ast_manipulators import ModuleImporter, FunctionInserter, ReturnModifier
from output_dto import FunctionCall, FunctionCallerInfoEncoder
from inspect import getargvalues, getsource
from collections import defaultdict
import json
import importlib
from uuid import uuid4

func_calls = defaultdict(lambda: FunctionCall())

def get_function_call_string(func, current_frame):
    args = getargvalues(current_frame)
    current_call_args = []
    for key in args.args:
        current_call_args.append("{}={}".format(key, args.locals[key]))

    call_id = "{}={}".format("__call_id__", hash(uuid4()))
    return "{}({})${}".format(func.__name__, ", ".join(current_call_args), call_id)

def get_caller_function_call_string(caller_frame):
    caller_function = caller_frame.f_locals.get("__current_func_call__")

    if caller_function is None:
        return "<module>"
    return caller_function

def record_func_call(current_func_call: str, caller_func_call: str, caller_frame_info, ret_val):
    func_calls[current_func_call] = FunctionCall(caller_func_call, caller_frame_info.lineno, ret_val)

def count_function_calls(func_calls: defaultdict) -> defaultdict:
    counts = defaultdict(lambda: 0)
    for key in func_calls:
        split_key = key.split("(")
        func_name = split_key[0]
        func_args = split_key[1].split(', ')[0: -1]     # remove the unique id
        func_call = "{}({})".format(func_name, ", ".join(func_args))
        counts[func_call] += 1

    return counts

if __name__ == "__main__":
    module_to_analyse = importlib.import_module("test_module")
    source_code = getsource(module_to_analyse)

    tree = parse(source_code)
    ModuleImporter().visit(tree)
    FunctionInserter().visit(tree)
    modified_tree = fix_missing_locations(ReturnModifier().visit(tree))

    exec(compile(modified_tree, filename='<ast>', mode='exec'))

    function_call_counts = count_function_calls(func_calls)

    response = {"function_calls": func_calls, "totals": function_call_counts}

    print(json.dumps(response, indent=4, cls=FunctionCallerInfoEncoder))

    with open(os.path.join(sys.path[0], "func_calls.json"), 'w') as f:
        json.dump(response, f, indent=4, cls=FunctionCallerInfoEncoder)