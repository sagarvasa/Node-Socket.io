let update = (constant_name, constant_value) => {
    Object.defineProperty(exports, constant_name, {
        value: constant_value,
    });
};

update('not_found_message', 'requested resource is not found');
update('corr_id', 'correlation_id');
update('not_found', 404)
