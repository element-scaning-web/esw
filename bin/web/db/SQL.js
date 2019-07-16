/***************sql**************/
exports.SQLProject = 'select id,project_name from atp_project';
exports.SQLPage = 'select id,page_name from atp_page where project_id=?';
exports.SQLElements = 'select id,element_name,element_value,element_frame,element_index, ' + 
					'(select type_name from omg_fsp_dict_data where type_class_code = "ELEMENT_FINDER_TYPE" and type_id = element_type) as element_finder, ' +
					'(select type_name from omg_fsp_dict_data where type_class_code = "ELEMENT_TYPE" and type_id = element_type) as element_type ' +
					' from atp_element '+
					'where page_id=?';